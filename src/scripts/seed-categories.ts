// import { db } from '@/db'
// import { eq, inArray } from 'drizzle-orm'
// import { categories, playLists, users } from '@/db/schema'
// import { useAuth } from '@clerk/nextjs';
// import { toast } from 'sonner';
// const categoriesName =[
//     "Comedy",
//     "Education",
//     "Entertainment",
//     "Sports",
//     "Musics",
//     "Gaming",
//     "News and politics",
//     "Travel and events",
//     "Science and technology",
//     "Film and animations",
//     "Pet and animals"
// ];

// async function main(){
    
//     try{
//           const values = categoriesName.map((name) => ({
//             name,
//             description: `Videos related to ${name.toLowerCase()}`, 
//         }))
//          await db.insert(categories).values(values)
//    console.log("very good ")
//        }
      
      
     
//     catch(error){
//          console.error("Erros sending categories", error)
//          process.exit(1)
//     }
// }

// main();