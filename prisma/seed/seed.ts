/**
 * ! Executing this script will delete all data in your database and seed it with 10 topic.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */

import { createSeedClient } from '@snaplet/seed';
import { copycat } from '@snaplet/copycat';
import bcrypt from 'bcrypt';

const main = async () => {
  const seed = await createSeedClient();

  // Truncate all tables in the database
  await seed.$resetDatabase();

  // Seed the database with 10 users
  await seed.user((x) =>
    x(10, ({ seed }) => ({
      email: copycat.email(seed),
      username: copycat.username(seed),
      password: bcrypt.hashSync(copycat.username(seed), 10),
      articles: (x) =>
        x(5, ({ seed }) => ({
          title: copycat.sentence(seed),
          subtitle: copycat.sentence(seed),
          content: copycat.paragraph(seed),
          draft: copycat.bool(seed),
          topic: {
            name: copycat.word(seed),
            description: copycat.sentence(seed),
            image: copycat.url(seed),
          },
        })),
    })),
  );

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  console.log('Database seeded successfully!');

  process.exit();
};

main();
