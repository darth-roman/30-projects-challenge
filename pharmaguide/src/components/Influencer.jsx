export function Influencer({imgSrc, aliasName, realName, instagramName, country, faculty}){
    return(
        <div class="influencer">
            <div class="image">
                <img src={imgSrc} alt="" />
            </div>
            <div class="deets">
                <h4>{aliasName} / {realName}</h4>
                <a href={instagramName}>@{instagramName}</a>
                <p>{country} / {faculty}</p>
            </div>
        </div>
    )
}