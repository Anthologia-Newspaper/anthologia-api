# Anthologia API

Anthologia is an uncensorable article platform that harnesses the power of IPFS (InterPlanetary File System) to provide users with the freedom to write and read articles without restrictions. Our mission is to empower voices across the globe, allowing for the unrestricted exchange of ideas and information.

## How does it work?

The Anthologia API serves as the backbone of the platform, enabling essential functionalities such as user registration, sign-in, article publishing, and reading. Users can organize their published articles into thematic collections known as 'Anthologies.' Built on a robust tech stack consisting of Node.js, NestJS, and Prisma, the API is hosted on Google Cloud Platform (GCP) with a scalable database managed by neon.tech. The entire application is containerized using Docker, ensuring seamless deployment and management.

## Getting Started

### Installation

To set up the Anthologia API locally, ensure you have Docker and Docker Compose installed. Here are the installation instructions:

```bash
# Update your package index
sudo apt-get update

# Install Docker
sudo apt-get install docker.io

# Install Docker Compose
sudo apt-get install docker-compose
```

### Quickstart
Once you have the necessary dependencies installed, you can quickly get the API server up and running. Execute the following command in your terminal :

```bash
docker-compose up --build
```
Before starting, make sure to configure your environment variables as specified in the .env.example file provided in the repository.

### Usage
After launching the server, you can explore all available API endpoints at `http://localhost:8080/doc`. Detailed documentation, including examples of requests and responses, can be accessed via Swagger at `http://localhost:8080/doc`.

Prisma Studio should also be setup at `http://localhost:5555`

The API employs JWTs (JSON Web Tokens) for authentication, utilizing access and refresh tokens that are securely stored in cookies. This ensures a streamlined and secure user experience.

## Get involved
We warmly invite you to contribute to this project! For guidance on how to get involved, please refer to our contributing guide.

 🚀 Don't forget to follow us on our various social networks, and consider starring 🌟 the Anthologia repositories to show your support!


If you encounter any issues or have questions, please reach out to us at anthologia.net@gmail.com.

Join us in our journey towards Cryptoanarchy and the liberation of knowledge!

>Made with ❤️ by the Anthologia Team
