package pkg

type Permission rune


const (
    Read    Permission = 'r'
    Write   Permission = 'w'
    Execute Permission = 'x'
)


type User struct {
	ID        int 	`json:"id"`
	Username  *string `json:"username"`
	Password  *string  `json:"password"`
	Permission *Permission `json:"permissions"`
}


func (p Permission) IsValid() bool {
    switch p {
    case Read, Write, Execute:
        return true
    default:
        return false
    }
}


