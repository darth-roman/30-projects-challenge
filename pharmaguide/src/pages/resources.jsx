import { useEffect } from "react";
import { AITool } from "../components/AITool";
import { Channel } from "../components/Channel";
import { Drive } from "../components/Drive";
import { Link } from "../components/Link";
import { useState } from "react";
import { supabase } from "../utils/supabase";
export function Resources (){
        const [channels, setChannels] = useState([])
        const [drives, setDrives] = useState([])
        const [aiTools, setAITools] = useState([])
        const [links, setLinks] = useState([])
        const [loading, setLoading] = useState(true)
        const [errorMessage, setErrorMessage] = useState('')
    
        async function fetchChannels(){
            const { data, error } = await supabase.schema("public").from("channels").select("*")
            if (error) {
                throw error
            }
            return data
        }

        async function fetchDrive(){
            const { data, error } = await supabase.schema("public").from("drives").select("*").order("drive_name", { ascending: false })
            if (error) {
                throw error
            }
            return data
        }

        async function fetchAILinks(){
            const { data, error } = await supabase.schema("public").from("ai_tools").select("*")
            if (error) {
                throw error
            }
            return data
        }

        async function fetchLinks(){
            const { data, error } = await supabase.schema("public").from("links").select("*")
            if (error) {
                throw error
            }
            return data
        }
    
    
        useEffect(() => {
            let cancelled = false
    
            fetchChannels().then((data) => {
                if (!cancelled) {
                    setChannels(data)
                    setLoading(false)
                }
            }).catch((error) => {
                if (!cancelled) {
                    console.error(error)
                    setErrorMessage(error.message || 'Unable to load subjects.')
                    setLoading(false)
                }
            })

            fetchDrive().then((data) => {
                if (!cancelled) {
                    setDrives(data)
                    setLoading(false)
                }
            }).catch((error) => {
                if (!cancelled) {
                    console.error(error)
                    setErrorMessage(error.message || 'Unable to load drives.')
                    setLoading(false)
                }
            })

            fetchAILinks().then((data) => {
                if (!cancelled) {
                    setAITools(data)
                    setLoading(false)
                }
            }).catch((error) => {
                if (!cancelled) {
                    console.error(error)
                    setErrorMessage(error.message || 'Unable to load drives.')
                    setLoading(false)
                }
            })

            fetchLinks().then((data) => {
                if (!cancelled) {
                    setLinks(data)
                    setLoading(false)
                }
            }).catch((error) => {
                if (!cancelled) {
                    console.error(error)
                    setErrorMessage(error.message || 'Unable to load drives.')
                    setLoading(false)
                }
            })
    
            
    
            return () => {
                cancelled = true
            }
        }, [])
    return(
        <>
            <section id="section-nav">
                <a href="#drives" className="nav-item">
                    Drives
                </a>
                <a href="#yt-channels" className="nav-item">
                    YT
                </a>
                <a href="#ai-tools" className="nav-item">
                    AI
                </a>
                <a href="#influencers" className="nav-item">
                    Figures
                </a>
            </section>

            <div className="title">
                <span className="material-icons">folder</span>
                <h2>Last Years Drives</h2>
            </div>
            <section id="drives">
                {loading && <p>Loading drives...</p>}
                {!loading && errorMessage && <p>{errorMessage}</p>}
                {!loading && !errorMessage && drives.length === 0 && <p>No drives found.</p>}
                {!loading && !errorMessage && drives.map((drive) => (
                    <Drive 
                        driveName={drive.drive_name}
                        driveUrl={drive.drive_url}
                        year={drive.drive_year} 
                    />
                ))}
            </section>

            <div className="title">
                <span className="material-icons">cast</span>
                <h2>Recommended Channels</h2>
            </div>
            <section id="yt-channels">
                {loading && <p>Loading channels...</p>}
                {!loading && errorMessage && <p>{errorMessage}</p>}
                {!loading && !errorMessage && channels.length === 0 && <p>No channels found.</p>}
                {!loading && !errorMessage && channels.map((channel) => (
                    <Channel
                        key={channel.id}
                        imgSrc={channel.img_src}
                        channelUrl={channel.channel_url}
                        channelName={channel.channel_name}
                        channelDesc={channel.channel_desc}
                        subject={channel.subject}
                    />
                ))}
            </section>


            <div className="title">
                <span className="material-icons">smart_toy</span>
                <h2>AI Tools & Websites</h2>
            </div>
            <section id="ai-tools">
                {loading && <p>Loading AI Tools...</p>}
                {!loading && errorMessage && <p>{errorMessage}</p>}
                {!loading && !errorMessage && aiTools.length === 0 && <p>No AI Tools found.</p>}
                {!loading && !errorMessage && aiTools.map((aiTool) => (
                    <AITool
                        key={aiTool.id}
                        title={aiTool.title}
                        toolUrl={aiTool.tool_url}
                        subjects={aiTool.subjects}
                    />
                ))}
                
            </section>

            <div className="title">
                <span className="material-icons">tag</span>
                <h2>Pharmacy Social Media Links</h2>
            </div>

            <div id="influencers">
                {loading && <p>Loading AI links...</p>}
                {!loading && errorMessage && <p>{errorMessage}</p>}
                {!loading && !errorMessage && links.length === 0 && <p>No Links found.</p>}
                {!loading && !errorMessage && links.map((link) => (
                    <Link 
                        key={link.id}
                        linkIcon={link.link_icon}
                        linkName={link.link_name}
                        linkUrl={link.link_url}
                        country={link.country}
                        faculty={link.faculty}
                        subjects={link.subjects} />

                ))}
                {/* <Link linkIcon="bookmark" linkName="someAlias" linkUrl="someName" country="Algeria" faculty="Constantine 3" subjects="Pharmacy, bla bla bla" />
                <Link linkIcon="http" aliasName="someAlias" realName="" instagramName="someName" country="Algeria" faculty="Constantine 3" /> */}
            </div>
        </>
    )
}

