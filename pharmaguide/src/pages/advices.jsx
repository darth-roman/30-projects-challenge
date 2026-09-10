import { useState } from "react";
import { Advice } from "../components/Advice";
import { supabase } from "../utils/supabase"
import { useEffect } from "react";


export function Advices(){
    const [advices, setAdvices] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')

    async function fetchAdvices(){
        const { data, error } = await supabase.schema("public").from("advices").select("*")
        if (error) {
            throw error
        }
        return data
    }

    useEffect(() => {
        let cancelled = false

        fetchAdvices().then((data) => {
            if (!cancelled) {
                setAdvices(data)
                setLoading(false)
            }
        }).catch((error) => {
            if (!cancelled) {
                console.error(error)
                setErrorMessage(error.message || 'Unable to load subjects.')
                setLoading(false)
            }
        })

        return () => {
            cancelled = true
        }
    }, [])

    return(
        <>
            <section id="intro">
                <div className="informative">
                    <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/mascot.jpeg`} alt="" />
                    <h1>Advices</h1>
                    <p>Meet your actual guide, <strong>Galenus the Snake</strong>, your skillful and wise Pharmacist</p>
                    <p>Here, you will find some words of wisdom by previous students who have been in the same journey as you are</p>
                    <p>I kept as raw as i received them so you can get the full picture (And because i am slacking off to edit 💀🤡)</p>
                </div>
            </section>
            <section id="advices">
                {loading && <p>Loading Advices...</p>}
                {!loading && errorMessage && <p>{errorMessage}</p>}
                {!loading && !errorMessage && advices.length === 0 && <p>No advices found.</p>}
                {!loading && !errorMessage && advices.map((advice) => (
                <Advice
                    key={advice.id}
                    authorName={advice.advice_author}
                    authorOccupation={advice.occupation}
                    adviceBody={advice.advice_body}
                />
            ))}
            </section>
        </>
    )
}
