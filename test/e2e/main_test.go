package e2e

import (
	"testing"
	// "github.com/wharf/wharf/test/framework"
)

func TestAll(t *testing.T) {
	// framework.InitAdminUser()
	t.Run("TestContainer", testGetContainers)

}
