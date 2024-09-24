package cache

import (
	"testing"
)

func TestGetSet(t *testing.T) {
	cache := New(10)
	cache.Set("key1", "value1")
	val := cache.Get("key1")
	if val != "value1" {
		t.Errorf("Expected value1, got %s", val)
	}
}

func TestInvalidate(t *testing.T) {
	cache := New(10)
	cache.Set("key1", "value1")
	cache.Invalidate("key1")
	val := cache.Get("key1")
	if val != nil {
		t.Errorf("Expected nil, got %s", val)
	}
}
