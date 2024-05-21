package pkg

import (
	"bufio"
	"os"
	"strings"
)

const initPasswordFile = "/var/lib/wharf/wharf.txt"

func GetInitPassword() (*string, error) {
	file, err := os.Open(initPasswordFile)
	if err != nil {
		return nil, err 
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)

	for scanner.Scan(){
		line := scanner.Text()
		if strings.HasPrefix(line, "PASSWORD=") {
			password := strings.TrimPrefix(line, "PASSWORD=")
            password = strings.TrimSpace(password)
			return &password, nil
		}
	}
	if err := scanner.Err(); err!= nil {
		return nil, err
	}
	return nil, nil
}