import { GraphQLServer, PubSub } from "graphql-yoga";
import jwt from "jsonwebtoken";

import db from "./db";

// let usuarios = [
//   { id: "1", nome: "beto", email: "herbert@example.com" },
//   { id: "2", nome: "finho", email: null },
//   { id: "3", nome: "teleco", email: "teleco@example.com" }
// ];

// let publicacoes = [
//   { id: "1", titulo: "lula preso", autor: "1" },
//   { id: "2", titulo: "bolsonaro presidente", autor: "3" }
// ];

const pubsub = new PubSub();

const resolvers = {
  Query: {
    nome() {
      return "beto";
    },
    hello(parent, args, ctx, info) {
      return "Hello " + args.nome;
    },
    me() {
      return {
        id: "12345",
        nome: "beto",
        email: "herbert@example.com"
      };
    },
    publicacao() {
      return {
        id: "1",
        titulo: "Bolsonaro eleito presente do BR"
      };
    },
    usuarios(parent, args, ctx, info) {
      if (args.nome) {
        return usuarios.filter(u => u.nome === args.nome);
      }

      return usuarios;
    },
    publicacoes() {
      return publicacoes;
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const user = {
        id: "17",
        ...args.data
      };

      usuarios.push(user);

      return user;
    }
  },
  Subscription: {
    // o resoler do subscript recebe um object com
    // metodo subscribe
    count: {
      subscribe(parent, args, ctx, info) {
        let contador = 0;

        setInterval(() => {
          contador++;
          //tem que retornar um objeto com uma propriedade com o mesmo nome do que está declarado no schema
          ctx.pubsub.publish("count", { count: contador });
        }, 1000);

        // count is chanel name
        return ctx.pubsub.asyncIterator("count");
      }
    }
  },
  Publicacao: {
    autor(parent, args, ctx, info) {
      return usuarios.find(u => u.id === parent.autor);
    }
  },
  Usuario: {
    publicacoes(parent, args, ctx, info) {
      return publicacoes.filter(p => p.autor === parent.id);
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  // context tambem pode ser uma function
  // nesse caso a assinatura da fn recebe a request
  // a qual podemos passar no context pra em cada mutation
  // extrair o token que fazer a validação necessária
  // os headers estarao em request.request.headers
  context(request) {
    return {
      db,
      pubsub,
      request
    };
  }

  // context: {
  //   db,
  //   pubsub
  // }
});

server.start(() => console.log("server is running on localhost:4000"));
