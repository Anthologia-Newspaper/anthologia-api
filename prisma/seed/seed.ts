import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  // Read the seed data from the JSON file
  const dataPath = path.join(__dirname, 'seed-data.json');
  const seedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Seed users
  for (const user of seedData.users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        username: user.username,
        email: user.email,
        password: await bcrypt.hash(user.password, 10),
        profilePicCid: user.profilePicCid,
        roles: user.roles,
      }
    });
  }

  // Seed topics
  for (const topic of seedData.topics) {
    await prisma.topic.upsert({
      where: { id: topic.id },
      update: {},
      create: {
        name: topic.name,
        description: topic.description,
        image: topic.image,
      }
    });
  }

  // Seed articles
  for (const article of seedData.articles) {
    await prisma.article.upsert({
      where: { id: article.id },
      update: {},
      create: {
        title: article.title,
        subtitle: article.subtitle,
        authorId: article.authorId,
        topicId: article.topicId,
        cid: article.cid,
        content: article.content,
        draft: article.draft,
        viewCounter: article.viewCounter,
        likeCounter: article.likeCounter
      }
    });
  }

  // Seed Anthologies
  for (const anthology of seedData.anthologies) {
    await prisma.anthology.upsert({
      where: { id: anthology.id },
      update: {},
      create: {
        userId: anthology.id,
        name: anthology.name,
        description: anthology.description,
      }
    })
    // for (const articleId of anthology.articles) {
    //   const article = await prisma.article.findFirst({where: { id: articleId }})

    //   await prisma.anthology.
    // }
  }

  // Seed Events
  for (const event of seedData.events) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: {
        type: event.type,
        createdById: event.createdById,
        articleId: event.articleId,
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// const main = async () => {
  // TODO: any types, it has to be commented until fixed

  // const seed = await createSeedClient();

  // // Truncate all tables in the database
  // await seed.$resetDatabase();

  // // Seed the database with 10 users
  // await seed.user((x) =>
  //   x(10, ({ seed }) => ({
  //     email: copycat.email(seed),
  //     username: copycat.username(seed),
  //     password: bcrypt.hashSync(copycat.username(seed), 10),
  //     articles: (x) =>
  //       x(5, ({ seed }) => ({
  //         title: copycat.sentence(seed),
  //         subtitle: copycat.sentence(seed),
  //         content: copycat.paragraph(seed),
  //         draft: copycat.bool(seed),
  //         topic: {
  //           name: copycat.word(seed),
  //           description: copycat.sentence(seed),
  //           image: copycat.url(seed),
  //         },
  //       })),
  //   })),
  // );

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  // console.log('Database seeded successfully!');

  // process.exit();
// };

// main();

