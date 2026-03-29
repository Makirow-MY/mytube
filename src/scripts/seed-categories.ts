import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { categories } from '@/db/schema'
const categoriesName =[
    "Comedy",
    "Education",
    "Entertainment",
    "Sports",
    "Musics",
    "Gaming",
    "News and politics",
    "Travel and events",
    "Science and technology",
    "Film and animations",
    "Pet and animals"
];

async function main(){
    try{
        const values = categoriesName.map((name) => ({
            name,
            description: `Videos related to ${name.toLowerCase()}`, 
        }))
       await db.insert(categories).values(values)
       console.log("categories added succesffully")
    }
    catch(error){
         console.error("Erros sending categories", error)
         process.exit(1)
    }
}

main();