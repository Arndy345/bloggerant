<h1 align="center">Welcome to bloggerant 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://twitter.com/nonso_andy" target="_blank">
    <img alt="Twitter: nonso_andy" src="https://img.shields.io/twitter/follow/nonso_andy.svg?style=social" />
  </a>
</p>

> A mini blog api that allows you post and follow hot gists going on in the country.

## Built with

<div align="center">

![Javascript][javascript]
![Node.js][node]
![Express.js][express]
![MongoDB][mongodb]

</div>
## Clone this repo

```sh
git clone https://github.com/Arndy345/bloggerant.git
```
###Dependencies
- Create a .env file
- Add the MONGO_URI, JWT_SECRET and PORT to the file 
## Install

```sh
npm install
```

## Usage

```sh
npm run dev
```

## Run tests

```sh
npm run test
```



---

<!-- AltSchool Requirements -->

## Requirements

<details>

<summary> <strong>Requirements for the examination project</strong> </summary>

- [x] Users should have a first_name, last_name, email, password,

- [x] A user should be able to sign up and sign in into the blog app

- [x] Use JWT as authentication strategy and expire the token after 1 hour

- [x] A blog can be in two states; draft and published

- [x] Logged in and not logged in users should be able to get a list of published blogs created

- [x] Logged in and not logged in users should be able to to get a published blog

- [x] Logged in users should be able to create a blog.

- [x] When a blog is created, it is in draft state

- [x] The owner of the blog should be able to update the state of the blog to published

- [x] The owner of a blog should be able to edit the blog in draft or published state

- [x] The owner of the blog should be able to delete the blog in draft or published state

- [x] The owner of the blog should be able to get a list of their blogs.

- [x] The endpoint should be paginated

- [x] It should be filterable by state

- [x] Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.

- [x] The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated:

  - [x] default it to 20 blogs per page.

  - [x] It should also be searchable by author, title and tags.

  - [x] It should also be orderable by read_count, reading_time and timestamp

- [x] When a single blog is requested, the api should return the user information (the author) with the blog. The read_count of the blog too should be updated by 1

- [x] Come up with any algorithm for calculating the reading_time of the blog.

- [x] Write tests for all endpoints

</details>

---

## Setup

- Install [Node.js](https://nodejs.org/en/download/), [MongoDB](<(https://www.mongodb.com/docs/manual/installation/)>)
- pull this repo
- update env

---

## Base URL

https://bloggerant.onrender.com/api-docs

## APIs

---

## Readme Guides
- [Model](./model/README.md)
- [Route](./routes/README.md)
## Author

👤 **Nonso Andrew**

- Twitter: [@nonso_andy](https://twitter.com/nonso_andy)
- Github: [@arndy345](https://github.com/arndy345)
- LinkedIn: [@Nonso Andrew](https://linkedin.com/in/nonsougbodu)
- Project Link: [Bloggerant](https://github.com/Arndy345/bloggerant)

<!-- Markdown Links & Images -->

<!-- [contributors-shield]: https://img.shields.io/github/contributors/Arndy345/bloggerant.svg?style=for-the-badge
[contributors-url]: https://github.com/Arndy345/bloggerant/graphs/contributors -->

[javascript]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1C
[node]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[express]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[mongodb]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
