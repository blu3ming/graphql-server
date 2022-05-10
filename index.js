import {ApolloServer, gql} from 'apollo-server'

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
        phone: "22222222",
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
    type Persona{
        name: String!
        phone: String
        street: String!
        city: String!
        id: ID!
    }

    type Query{
        personCount: Int!
        allPersons: [Persona]!
        findPersona(name: String!): Persona
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
    Persona: {
        address: (root) => `${root.street}, ${root.city}`
    }
}

const server = new ApolloServer ({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Server listening at ${url}`);
})