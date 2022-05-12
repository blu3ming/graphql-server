import {ApolloServer, gql, UserInputError} from 'apollo-server'
import {v1 as uuid} from 'uuid'

const personas = [
    {
        name: "Hyojung",
        phone: "11111111",
        street: "10",
        city: "Seoul",
        id: "OMG-1"
    },
    {
        name: "Seunghee",
        street: "11",
        city: "Seoul",
        id: "OMG-2"
    },
    {
        name: "Yooa",
        phone: "33333333",
        street: "12",
        city: "Seoul",
        id: "OMG-3"
    }
]

const typeDefs = gql`
    enum YesNo {
        YES
        NO
    }

    type Address{
        street: String!
        city: String!
    }

    type Persona{
        name: String!
        phone: String
        address: Address!
        id: ID!
    }

    type Query{
        personCount: Int!
        allPersons(phone: YesNo): [Persona]!
        findPersona(name: String!): Persona
    }

    type Mutation{
        addPersona(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Persona
    }
`

const resolvers = {
    Query: {
        personCount: () => personas.length,
        allPersons: () => personas,
        findPersona: (root, args) => {
            const {name} = args
            return personas.find(persona => persona.name === name)
        }
    },
    Mutation: {
        addPersona: (root, args) => {
            if (personas.find(persona => persona.name === args.name)){
                throw new UserInputError('Name must be unique', {
                    invalidArgs: args.name
                })
            }
            //const {name, phone, street, city} = args;
            const persona = {...args, id: uuid()}
            personas.push(persona);
            return persona;
        }
    },
    Persona: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }
    }
}

const server = new ApolloServer ({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Server listening at ${url}`);
})