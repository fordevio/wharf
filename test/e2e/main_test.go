package e2e

import (
	"github.com/wharf/wharf/test/framework"
	"testing"
)

func TestAll(t *testing.T) {
	framework.InitAdminUser()
	t.Run("TestContainer", testGetContainers)

}
