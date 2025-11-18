import Head from 'next/head'

const PAYLINK_PRO = "#" // replace with Razorpay link later
const PAYLINK_AGENCY = "#" // replace with Razorpay Agency link later
const DFY_FORM = "#" // replace with Google Form link later

export default function Home() {
  return (
    <>
      <Head><title>ClientifyX — WhatsApp CRM</title></Head>
      <main style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh',flexDirection:'column',gap:16,padding:20}}>
        <h1 style={{fontSize:28}}>ClientifyX — WhatsApp CRM & Autoresponder</h1>
        <p style={{maxWidth:800,textAlign:'center'}}>Automate WhatsApp replies, capture leads & follow up. Lifetime preorders: Pro ₹4,999 • Agency ₹19,999. Limited slots.</p>
        <div style={{display:'flex',gap:12,marginTop:16}}>
          <a href={PAYLINK_PRO} style={{padding:'10px 16px',background:'#0b74ff',color:'#fff',borderRadius:8,textDecoration:'none'}}>Preorder — Pro ₹4,999</a>
          <a href={PAYLINK_AGENCY} style={{padding:'10px 16px',background:'#0ea5a4',color:'#fff',borderRadius:8,textDecoration:'none'}}>Agency ₹19,999</a>
        </div>
        <div style={{marginTop:12}}>
          <a href={DFY_FORM} target="_blank" rel="noreferrer" style={{textDecoration:'underline'}}>Reserve DFY Setup slot (we'll do it for you)</a>
        </div>
        <small style={{marginTop:12}}>Deployed on Vercel • Domain: clientifyx.info</small>
      </main>
    </>
  )
}
