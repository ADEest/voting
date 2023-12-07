import Image from "next/image";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Admin } from "@/types";
import VoteForm from "@/components/VoteForm";
export const revalidate = 0;
const people = [
  {
    name: 'Christian Mikel',
    role: 'Labour group',
    imageUrl:
      'https://i.pinimg.com/564x/a6/66/0b/a6660be2e941186f42f7f9a25fb7d715.jpg',
  },
  {
    name: 'Harry Mcquire',
    role: 'Independent',
    imageUrl:
      'https://i.pinimg.com/564x/08/62/42/0862426428c3d3b3bdb98d670bb3e180.jpg',
  },
  {
    name: 'Helen Sharks',
    role: 'Conservative',
    imageUrl:
      'https://i.pinimg.com/564x/c7/6b/3f/c76b3f38a6b60c338d6534b4eacc9af2.jpg',
  },
  {
    name: 'Eric Holmes',
    role: 'Liberal',
    imageUrl:
      'https://i.pinimg.com/564x/96/f7/8f/96f78f488746f77baf995fdd17ac59db.jpg',
  },
  // More people...
]


export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = (await supabase.from("voters").select("*")) as {
    data: Admin[];
  };



  return (
    <>
     <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Presidential  Candidates</h2>
          <p className="mt-3 text-lg leading-8 text-gray-600">
           Your vote, your voice. Candidates - Your gateway to informed decisions. Explore, learn, and vote for your next president. Stay updated, engage actively, and shape the future of your nation. Every vote counts, make yours count too with Candidates.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-x-2 gap-y-16 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-4 xl:grid-cols-4"
        >
            <VoteForm data={data} people={people} />
        </ul>
      </div>
    </div>
    </>
  );
}
