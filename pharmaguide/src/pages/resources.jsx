import { AITool } from "../components/AITool";
import { Channel } from "../components/Channel";
import { Drive } from "../components/Drive";
import { Influencer } from "../components/Influencer";

export function Resources (){
    return(
        <>
            <section id="section-nav">
                <a href="#drives" class="nav-item">
                    Drives
                </a>
                <a href="#yt-channels" class="nav-item">
                    YT
                </a>
                <a href="#ai-tools" class="nav-item">
                    AI
                </a>
                <a href="#influencers" class="nav-item">
                    Figures
                </a>
            </section>

            <div class="title">
                <span class="material-icons">folder</span>
                <h2>Last Years Drives</h2>
            </div>
            <section id="drives">
                <Drive driveName="Drive Name" driveUrl="href" year="2026/2027" />
                <Drive driveName="Drive Name" driveUrl="href" year="2026/2027" />
                <Drive driveName="Drive Name" driveUrl="href" year="2026/2027" />
            </section>

            <div class="title">
                <span class="material-icons">cast</span>
                <h2>Recommended Channels</h2>
            </div>
            <section id="yt-channels">
                <Channel imgSrc="src/assets/hero.png" channelName="Channel Name" channelDesc="lorem ipsum" channelUrl="url" />
                <Channel imgSrc="src/assets/hero.png" channelName="Channel Name" channelDesc="lorem ipsum" channelUrl="url" />
            </section>


            <div class="title">
                <span class="material-icons">smart_toy</span>
                <h2>AI Tools</h2>
            </div>
            <section id="ai-tools">
                <AITool title="NotebookLM" />
                
            </section>

            <div class="title">
                <span class="material-icons">tag</span>
                <h2>Pharmacy Social Media Links</h2>
            </div>

            <div id="influencers">
                <Influencer imgSrc="src/assets/hero.png" aliasName="someAlias" realName="" instagramName="someName" country="Algeria" faculty="Constantine 3" />
                <Influencer imgSrc="src/assets/hero.png" aliasName="someAlias" realName="" instagramName="someName" country="Algeria" faculty="Constantine 3" />
            </div>
        </>
    )
}