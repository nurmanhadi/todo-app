import * as bcrypt from "bcrypt"

export class HashBcrypt {
    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10)
    }

    static async comparePassword(password: string, encrypted: string): Promise<boolean> {
        return bcrypt.compare(password, encrypted)
    }
}