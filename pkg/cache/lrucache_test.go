// Copyright 2025 The wharf Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
