package email

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"

	"github.com/resend/resend-go/v4"
)

func TestQREmailHTMLEscapes(t *testing.T) {
	html := qrEmailHTML(`<script>`, `A&B`)
	if strings.Contains(html, "<script>") {
		t.Error("name was not escaped")
	}
	if !strings.Contains(html, "A%26B") {
		t.Error("qr code was not url-encoded")
	}
}

func TestResendClientSend(t *testing.T) {
	var gotReq resend.SendEmailRequest
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost || r.URL.Path != "/emails" {
			t.Errorf("unexpected request: %s %s", r.Method, r.URL.Path)
		}
		if auth := r.Header.Get("Authorization"); auth != "Bearer test-key" {
			t.Errorf("unexpected authorization header: %q", auth)
		}
		if err := json.NewDecoder(r.Body).Decode(&gotReq); err != nil {
			t.Errorf("decode error: %v", err)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"id":"email_123"}`))
	}))
	defer server.Close()

	client := resend.NewClient("test-key")
	u, _ := url.Parse(server.URL)
	client.BaseURL = u

	resp, err := client.Emails.Send(&resend.SendEmailRequest{
		From:    defaultFrom,
		To:      []string{"test@semtik.id"},
		Subject: emailSubject,
		Html:    "<p>Hello</p>",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.Id != "email_123" {
		t.Errorf("unexpected id: %s", resp.Id)
	}
	if gotReq.From != "SEMTIK Admin <admin@semtik.id>" {
		t.Errorf("unexpected from: %s", gotReq.From)
	}
	if len(gotReq.To) != 1 || gotReq.To[0] != "test@semtik.id" {
		t.Errorf("unexpected to: %+v", gotReq.To)
	}
}

func TestResendClientBatch(t *testing.T) {
	var gotReqs []*resend.SendEmailRequest
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost || r.URL.Path != "/emails/batch" {
			t.Errorf("unexpected request: %s %s", r.Method, r.URL.Path)
		}
		if auth := r.Header.Get("Authorization"); auth != "Bearer test-key" {
			t.Errorf("unexpected authorization header: %q", auth)
		}
		if err := json.NewDecoder(r.Body).Decode(&gotReqs); err != nil {
			t.Errorf("decode error: %v", err)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"data":[{"id":"batch_1"},{"id":"batch_2"}]}`))
	}))
	defer server.Close()

	client := resend.NewClient("test-key")
	u, _ := url.Parse(server.URL)
	client.BaseURL = u

	batchResp, err := client.Batch.Send([]*resend.SendEmailRequest{
		{
			From:    defaultFrom,
			To:      []string{"p1@semtik.id"},
			Subject: emailSubject,
			Html:    "<p>P1</p>",
		},
		{
			From:    defaultFrom,
			To:      []string{"p2@semtik.id"},
			Subject: emailSubject,
			Html:    "<p>P2</p>",
		},
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(batchResp.Data) != 2 {
		t.Errorf("expected 2 responses, got %d", len(batchResp.Data))
	}
	if len(gotReqs) != 2 {
		t.Errorf("expected 2 requests, got %d", len(gotReqs))
	}
	if gotReqs[0].From != "SEMTIK Admin <admin@semtik.id>" {
		t.Errorf("unexpected from: %s", gotReqs[0].From)
	}
}

