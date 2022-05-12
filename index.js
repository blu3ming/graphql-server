import {ApolloServer, gql, UserInputError} from 'apollo-server'
import axios from 'axios'
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

    type Explorer{
        id: ID!
        name: String!
        username: String!
        mission: String!
        azureCertificacion: Boolean!
        dateCreated: String!
        lastUpdated: String!
    }

    type Query{
        personCount: Int!
        allPersons(phone: YesNo): [Persona]!
        allExplorersAPI: [Explorer]
        findPersona(name: String!): Persona
    }

    type Mutation{
        addPersona(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Persona
        editNumber(
            name: String!
            phone: String!
        ): Persona
    }
`

const resolvers = {
    Query: {
        personCount: () => personas.length,
        allPersons: (root, args) => {
            if (!args.phone) return personas
            const byPhone = persona =>
                args.phone === "YES" ? persona.phone : !persona.phone
            return personas.filter(byPhone)
        },
        allExplorersAPI: async() => {
            const {data: personsFromAPI} = await axios.get('http://localhost:3000/explorers')
            return personsFromAPI
        },
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
        },
        editNumber: (root, args) => {
            const personIndex = personas.findIndex(persona => persona.name === args.name)
            if (personIndex === -1) return null
            const person = personas[personIndex]
            const updatedPersona = {...person, phone : args.phone}
            personas[personIndex] = updatedPersona
            return updatedPersona
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