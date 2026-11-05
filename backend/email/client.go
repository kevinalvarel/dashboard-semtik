package email

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"time"
)

const (
	DefaultBaseURL = "https://api.resend.com"
	batchLimit     = 100
)

type Email struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	HTML    string   `json:"html"`
}

type Result struct {
	ID string `json:"id"`
}

type BatchResult struct {
	Data []Result `json:"data"`
}

type APIError struct {
	StatusCode int    `json:"statusCode"`
	Name       string `json:"name"`
	Message    string `json:"message"`
}

func (e *APIError) Error() string {
	if e.Name != "" {
		return e.Name + ": " + e.Message
	}
	return e.Message
}

type Client struct {
	APIKey     string
	From       string
	BaseURL    string
	HTTPClient *http.Client
}

func NewClient(apiKey, from string) *Client {
	return &Client{
		APIKey:     apiKey,
		From:       from,
		BaseURL:    DefaultBaseURL,
		HTTPClient: &http.Client{Timeout: 30 * time.Second},
	}
}

func (c *Client) Send(ctx context.Context, mail Email) (*Result, *APIError) {
	body, apiErr := c.post(ctx, "/emails", mail)
	if apiErr != nil {
		return nil, apiErr
	}
	var result Result
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, &APIError{Name: "decode_error", Message: err.Error()}
	}
	return &result, nil
}

func (c *Client) SendBatch(ctx context.Context, mails []Email) (*BatchResult, *APIError) {
	combined := BatchResult{}
	for start := 0; start < len(mails); start += batchLimit {
		end := min(start+batchLimit, len(mails))
		body, apiErr := c.post(ctx, "/emails/batch", mails[start:end])
		if apiErr != nil {
			return nil, apiErr
		}
		var chunk BatchResult
		if err := json.Unmarshal(body, &chunk); err != nil {
			return nil, &APIError{Name: "decode_error", Message: err.Error()}
		}
		combined.Data = append(combined.Data, chunk.Data...)
	}
	return &combined, nil
}

func (c *Client) post(ctx context.Context, path string, payload any) ([]byte, *APIError) {
	raw, err := json.Marshal(payload)
	if err != nil {
		return nil, &APIError{Name: "encode_error", Message: err.Error()}
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.BaseURL+path, bytes.NewReader(raw))
	if err != nil {
		return nil, &APIError{Name: "request_error", Message: err.Error()}
	}
	req.Header.Set("Authorization", "Bearer "+c.APIKey)
	req.Header.Set("Content-Type", "application/json")

	client := c.HTTPClient
	if client == nil {
		client = &http.Client{Timeout: 30 * time.Second}
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, &APIError{Name: "request_error", Message: err.Error()}
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, &APIError{Name: "request_error", Message: err.Error()}
	}
	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		return body, nil
	}

	apiErr := &APIError{StatusCode: resp.StatusCode}
	_ = json.Unmarshal(body, apiErr)
	if apiErr.Message == "" {
		apiErr.Message = string(body)
	}
	if apiErr.Name == "" {
		apiErr.Name = http.StatusText(resp.StatusCode)
	}
	return nil, apiErr
}
