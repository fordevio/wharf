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
		}
		log.Printf("Config directory created: %s", DirPath)
	} else if err != nil {
		log.Fatalf("Error checking config directory: %s", err)
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
		if err = file.Sync(); err != nil {
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
