package conf

import (
	"log"
	"os"
)

const DirPath = "/var/lib/wharf"

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
