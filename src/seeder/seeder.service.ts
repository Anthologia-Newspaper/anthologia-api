import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeederService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    const john = await this.prisma.user.create({
      data: {
        email: 'john@eip.com',
        username: 'john',
        password: '123456',
      },
    });

    const joe = await this.prisma.user.create({
      data: {
        email: 'joe@eip.com',
        username: 'joe',
        password: '123456',
      },
    });

    const daniel = await this.prisma.user.create({
      data: {
        email: 'daniel@eip.com',
        username: 'daniel',
        password: '123456',
      },
    });

    const robert = await this.prisma.user.create({
      data: {
        email: 'robert@eip.com',
        username: 'robert',
        password: '123456',
      },
    });

    const sophie = await this.prisma.user.create({
      data: {
        email: 'sophie@eip.com',
        username: 'sophie',
        password: '123456',
      },
    });

    const finance = await this.prisma.topic.create({
      data: {
        name: 'finance',
        description: 'Related to finance',
        image: 'finance-image',
      },
    });

    const ecologie = await this.prisma.topic.create({
      data: {
        name: 'ecologie',
        description: 'Related to ecologie',
        image: 'ecologie-image',
      },
    });

    const economie = await this.prisma.topic.create({
      data: {
        name: 'economie',
        description: 'Related to economie',
        image: 'economie-image',
      },
    });

    const computers = await this.prisma.topic.create({
      data: {
        name: 'computers',
        description: 'Related to computers',
        image: 'computers-image',
      },
    });

    const fitness = await this.prisma.topic.create({
      data: {
        name: 'fitness',
        description: 'Related to fitness',
        image: 'fitness-image',
      },
    });

    const article1 = await this.prisma.article.create({
      data: {
        draft: false,
        title: 'Everything you need to know about Finance',
        content:
          'Finance, a multifaceted domain governing the intricate dance of money, investments, and assets, is an indispensable cornerstone of modern life. Its profound influence extends far beyond mere transactions, permeating every aspect of our economic existence. From the prudent management of personal finances to the strategic maneuvering within global financial markets, the principles of finance underpin our daily decisions and shape the trajectory of our financial well-being. At its core, finance is a discipline of empowerment, offering individuals and organizations the tools to navigate the complexities of economic uncertainty and harness the potential of capital to fuel growth and prosperity. Within the vast landscape of finance lie a myriad of concepts, from the basic tenets of budgeting and saving to the sophisticated strategies of risk management and investment analysis. Understanding these concepts is not merely a matter of financial acumen; it is a vital skill that empowers individuals to seize control of their financial destinies and build a solid foundation for future prosperity. As we delve into the depths of finance, we uncover a rich tapestry of knowledge, from the inner workings of financial markets to the intricacies of corporate finance and the burgeoning realm of fintech innovation. Yet amidst the complexity, there exists a common thread: the pursuit of financial literacy as a catalyst for personal and collective empowerment. By arming ourselves with knowledge and embracing the principles of sound financial stewardship, we unlock the door to a world of opportunity and ensure a brighter, more secure future for ourselves and generations to come.',
        //author: john, error can't put the user like this
        authorId: john.id,
        //topic: finance,
        topicId: finance.id,
      },
    });

    const article2 = await this.prisma.article.create({
      data: {
        draft: false,
        title: 'Everything you need to know about Ecologie',
        content:
          'Finance, a multifaceted domain governing the intricate dance of money, investments, and assets, is an indispensable cornerstone of modern life. Its profound influence extends far beyond mere transactions, permeating every aspect of our economic existence. From the prudent management of personal finances to the strategic maneuvering within global financial markets, the principles of finance underpin our daily decisions and shape the trajectory of our financial well-being. At its core, finance is a discipline of empowerment, offering individuals and organizations the tools to navigate the complexities of economic uncertainty and harness the potential of capital to fuel growth and prosperity. Within the vast landscape of finance lie a myriad of concepts, from the basic tenets of budgeting and saving to the sophisticated strategies of risk management and investment analysis. Understanding these concepts is not merely a matter of financial acumen; it is a vital skill that empowers individuals to seize control of their financial destinies and build a solid foundation for future prosperity. As we delve into the depths of finance, we uncover a rich tapestry of knowledge, from the inner workings of financial markets to the intricacies of corporate finance and the burgeoning realm of fintech innovation. Yet amidst the complexity, there exists a common thread: the pursuit of financial literacy as a catalyst for personal and collective empowerment. By arming ourselves with knowledge and embracing the principles of sound financial stewardship, we unlock the door to a world of opportunity and ensure a brighter, more secure future for ourselves and generations to come.',
        //author: john, error can't put the user like this
        authorId: joe.id,
        //topic: finance,
        topicId: ecologie.id,
      },
    });

    const article3 = await this.prisma.article.create({
      data: {
        draft: false,
        title: 'Everything you need to know about Economics',
        content:
          'Economics, the study of how societies allocate scarce resources to fulfill unlimited wants and needs, is a fundamental pillar of human civilization. It provides insights into the mechanisms that drive production, consumption, and distribution, shaping the fabric of our social and economic systems. At its core, economics is a discipline of choices—choices made by individuals, businesses, and governments that have profound implications for the allocation of resources and the distribution of wealth.',
        //author: john, error can't put the user like this
        authorId: daniel.id,
        //topic: finance,
        topicId: economie.id,
      },
    });

    const article4 = await this.prisma.article.create({
      data: {
        draft: false,
        title: 'Everything you need to know about Computers',
        content:
          'Computers, the cornerstone of the digital age, are ubiquitous in modern society, revolutionizing the way we live, work, and communicate. From the powerful supercomputers that crunch vast amounts of data to the sleek smartphones that fit in the palm of our hands, computers come in various forms, each serving a unique purpose in our daily lives. At their essence, computers are marvels of engineering and innovation—sophisticated machines capable of processing information at lightning speed and executing complex tasks with precision and efficiency.',
        //author: john, error can't put the user like this
        authorId: robert.id,
        //topic: finance,
        topicId: computers.id,
      },
    });

    const article5 = await this.prisma.article.create({
      data: {
        draft: false,
        title: 'Everything you need to know about Fitness',
        content:
          "Fitness, the pursuit of physical well-being and vitality, is an integral aspect of human existence that encompasses both the body and mind. It is a journey of self-discovery and self-improvement, rooted in the fundamental principle of optimizing health and performance. From the rhythmic cadence of a morning run to the serene stillness of a yoga practice, fitness takes many forms, each offering its own unique benefits and rewards. At its core, fitness is a celebration of the human body's remarkable capacity for strength, endurance, and resilience—a testament to the power of determination and dedication in achieving our health and wellness goals.",
        //author: john, error can't put the user like this
        authorId: sophie.id,
        //topic: finance,
        topicId: fitness.id,
      },
    });
  }
}
