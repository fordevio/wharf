package conf

import (
	"bufio"
	"log"
	"math/rand"
	"os"
	"strings"
)

const DirPath = "/var/lib/wharf"
const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func InitDir() {
	if _, err := os.Stat(DirPath); os.IsNotExist(err) {
		err := os.MkdirAll(DirPath, 0755)
		if err != nil {
			log.Fatalf("Error creating configuration directory: %s", err)
			panic(err)
		}
		log.Printf("Config directory created: %s", DirPath)
	} else if err != nil {
		log.Fatalf("Error checking config directory: %s", err)
		panic(err)
	} else {
		log.Printf("Directory already exists: %s", DirPath)
	}
}

func InitPassword() {
	fileName := "/var/lib/wharf/wharf.txt"
	_, err := os.Stat(fileName)

	if os.IsNotExist(err) {
		file, err := os.Create(fileName)
		if err != nil {
			log.Panicln(err)
		}
		defer file.Close()
		pass := "PASSWORD=" + generateRandomString(14) + "\n"
		_, err = file.WriteString(pass)
		if err != nil {
			log.Panicln(err)
		}
	} else {
		file, err := os.Open(fileName)
		if err != nil {
			log.Panicln(err)
		}
		defer file.Close()
		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			line := scanner.Text()
			if strings.HasPrefix(line, "PASSWORD=") {
				return
			}
		}
		pass := "PASSWORD=" + generateRandomString(14) + "\n"
		_, err = file.WriteString(pass)
		if err != nil {
			log.Panicln(err)
		}
	}

}

func generateRandomString(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}
