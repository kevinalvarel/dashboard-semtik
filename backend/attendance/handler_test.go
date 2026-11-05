package attendance

import (
	"testing"
	"time"
)

func TestFirstNonEmpty(t *testing.T) {
	if got := firstNonEmpty("", "token", "code"); got != "token" {
		t.Errorf("firstNonEmpty = %q, want %q", got, "token")
	}
	if got := firstNonEmpty("", ""); got != "" {
		t.Errorf("firstNonEmpty = %q, want empty", got)
	}
}

func TestFormatTime(t *testing.T) {
	if got := formatTime(nil); got != "-" {
		t.Errorf("formatTime(nil) = %q, want -", got)
	}
	value := time.Date(2026, 11, 5, 9, 8, 7, 0, time.UTC)
	if got := formatTime(&value); got != "05/11/2026 09:08:07" {
		t.Errorf("formatTime = %q", got)
	}
}
