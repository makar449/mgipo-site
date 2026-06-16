import bcrypt from 'bcryptjs';

async function main(): Promise<void> {
  const password = process.argv[2];
  if (password === undefined || password.length < 8) {
    console.error('Usage: npm run admin:hash -- "your-password-min-8-chars"');
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 12);
  console.log(hash);
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
