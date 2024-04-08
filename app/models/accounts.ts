import { Account } from "@prisma/client";
import crypto from "node:crypto";

import { prisma } from "~/db.server";

class Accounts {
  find(id: Account["id"]): Promise<Account | null> {
    return prisma.account.findUnique({ where: { id } });
  }

  async exists(email: string): Promise<boolean> {
    const account = await prisma.account.findUnique({
      where: { email },
      select: { id: true },
    });

    return Boolean(account);
  }

  create(email: string, password: string): Promise<Account> {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = this.generateHash(password, salt);

    return prisma.account.create({
      data: {
        email: email,
        password: {
          create: { hash: [salt, hash].join(":") },
        },
      },
    });
  }

  async authenticate(email: string, password: string): Promise<Account["id"] | false> {
    const account = await prisma.account.findUnique({
      where: { email },
      select: { id: true, password: true },
    });

    if (!account || !account.password) {
      return false;
    }

    const [salt, hash] = account.password.hash.split(":");
    const inputHash = this.generateHash(password, salt);

    return hash === inputHash ? account.id : false;
  }

  private generateHash(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  }
}

export default new Accounts();
