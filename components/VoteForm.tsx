"use client";

import { Admin } from "@/types";
import Modal from "./Modal";
import { useState } from "react";

type VoteFormProps = {
    data: Admin[];
    people: {
        name: string;
        role: string;
        imageUrl: string;
    }[];
};

export default function VoteForm({ data, people }: VoteFormProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [party, setParty] = useState('');

    function handleImageClick(selectedRole: string) {
        console.log(selectedRole)
        setOpen(true);
        setParty(selectedRole);
    }
    function countPoliticalAffiliations(data: Admin[]) {
        const politicalAffiliations = [
            "Labour group",
            "Conservative",
            "Liberal",
            "Independent"
        ];
        const affiliationCounts: { [key: string]: number } = {};

        data.forEach(voter => {
            const affiliation = voter.PoliticalAffiliation;
            if (politicalAffiliations.includes(affiliation)) {
                if (affiliationCounts[affiliation]) {
                    affiliationCounts[affiliation]++;
                } else {
                    affiliationCounts[affiliation] = 1;
                }
            }
        });

        return affiliationCounts;
    }

    const result = countPoliticalAffiliations(data);

    return (
        <>
            {people.map(person =>
                <li key={person.name}>
                    <img
                        className="mx-auto h-auto w-64 cursor-pointer"
                        src={person.imageUrl}
                        alt=""
                        onClick={() => handleImageClick(person.role)}
                    />
                    <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">
                        {person.name}
                    </h3>
                    <p className="text-sm leading-6 text-gray-600">
                        {person.role}
                    </p>
                    {result[person.role] &&
                        <p>
                            Total Vote: {result[person.role]}
                        </p>}
                </li>
            )}
            <Modal open={open} setOpen={setOpen} party={party} />
        </>
    );
}
