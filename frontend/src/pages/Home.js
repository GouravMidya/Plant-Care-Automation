import React from "react";
import Homepage from "../components/Homepage";
import Layout1 from "../components/layout1";
import Layout2 from "../components/layout2";
import Contact from "../components/contact";
function Home(){
    return(
        <div>
            <Homepage/>
            <Layout1/>
            <Layout2/>
            <Contact/>
        </div>
    )
}

export default Home;
