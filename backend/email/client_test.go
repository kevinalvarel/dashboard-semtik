package email

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
)

func TestClientSend(t *testing.T) {
	var gotBody Email
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost || r.URL.Path != "/emails" {
			t.Errorf("unexpected request: %s %s", r.Method, r.URL.Path)
		}
		if auth := r.Header.Get("Authorization"); auth != "Bearer test-key" {
			t.Errorf("unexpected authorization header: %q", auth)
		}
		if err := json.NewDecoder(r.Body).Decode(&gotBody); err != nil {
			t.Errorf("decode body: %v", err)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"id":"abc-123"}`))
	}))
	defer server.Close()

	client := NewClient("test-key", onboardingFrom)
	client.BaseURL = server.URL

	result, apiErr := client.Send(context.Background(), Email{
		From:    onboardingFrom,
		To:      []string{"peserta@example.com"},
		Subject: emailSubject,
		HTML:    "<p>hai</p>",
	})
	if apiErr != nil {
		t.Fatalf("unexpected error: %v", apiErr)
	}
	if result.ID != "abc-123" {
		t.Errorf("unexpected id: %q", result.ID)
	}
	if gotBody.Subject != emailSubject || len(gotBody.To) != 1 || gotBody.To[0] != "peserta@example.com" {
		t.Errorf("unexpected body: %+v", gotBody)
	}
}

func TestClientError(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusUnprocessableEntity)
		_, _ = w.Write([]byte(`{"statusCode":422,"name":"validation_error","message":"You can only send testing emails to your own email address (owner@example.com)"}`))
	}))
	defer server.Close()

	client := NewClient("test-key", onboardingFrom)
	client.BaseURL = server.URL

	_, apiErr := client.Send(context.Background(), Email{From: onboardingFrom, To: []string{"x@example.com"}})
	if apiErr == nil {
		t.Fatal("expected error")
	}
	if apiErr.StatusCode != 422 || apiErr.Name != "validation_error" {
		t.Errorf("unexpected error: %+v", apiErr)
	}
}

func TestClientBatchChunks(t *testing.T) {
	var calls int32
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		atomic.AddInt32(&calls, 1)
		if r.URL.Path != "/emails/batch" {
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
		_, _ = w.Write([]byte(`{"data":[{"id":"abc"}]}`))
	}))
	defer server.Close()

	client := NewClient("test-key", onboardingFrom)
	client.BaseURL = server.URL

	mails := make([]Email, 101)
	for i := range mails {
		mails[i] = Email{From: onboardingFrom, To: []string{"x@example.com"}}
	}

	result, apiErr := client.SendBatch(context.Background(), mails)
	if apiErr != nil {
		t.Fatalf("unexpected error: %v", apiErr)
	}
	if got := atomic.LoadInt32(&calls); got != 2 {
		t.Errorf("expected 2 chunked requests, got %d", got)
	}
	if len(result.Data) != 2 {
		t.Errorf("expected 2 results, got %d", len(result.Data))
	}
}

func TestSandboxOwner(t *testing.T) {
	cases := map[string]string{
		"You can only send testing emails to your own email address (owner@example.com).": "owner@example.com",
		"no email here":  "",
		"(not-an-email)": "",
	}
	for message, want := range cases {
		if got := sandboxOwner(message); got != want {
			t.Errorf("sandboxOwner(%q) = %q, want %q", message, got, want)
		}
	}
}

func TestErrorClassifiers(t *testing.T) {
	if !isDomainError(&APIError{Message: "The domain is not verified"}) {
		t.Error("expected domain error")
	}
	if isDomainError(&APIError{Message: "rate limited"}) {
		t.Error("did not expect domain error")
	}
	if !isSandboxError(&APIError{Name: "validation_error", Message: "only send to your own email address"}) {
		t.Error("expected sandbox error")
	}
}

func TestQREmailHTMLEscapes(t *testing.T) {
	html := qrEmailHTML(`<script>`, `A&B`)
	if strings.Contains(html, "<script>") {
		t.Error("name was not escaped")
	}
	if !strings.Contains(html, "A%26B") {
		t.Error("qr code was not url-encoded")
	}
}
