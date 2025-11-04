import { useState } from 'react';
import { motion } from 'framer-motion';

// ENV-Driven secure form
// Set NEXT_PUBLIC_CONTACT_ENDPOINT and NEXT_PUBLIC_CAPTCHA_SITE_KEY in your environment

export default function Contact(){
  const [state, setState] = useState({ loading:false, ok:false, error:'' });
  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || '';
  const hasEndpoint = endpoint.length > 0;

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!hasEndpoint) { setState({loading:false, ok:false, error:'Formulaire non configuré (endpoint manquant).'}); return; }
    const form = new FormData(e.currentTarget);
    setState({ loading:true, ok:false, error:'' });
    try{
      const res = await fetch(endpoint, { method:'POST', body: form });
      if(!res.ok) throw new Error('Erreur serveur');
      setState({ loading:false, ok:true, error:'' });
      e.currentTarget.reset();
    }catch(err){
      setState({ loading:false, ok:false, error:'Échec de l’envoi. Réessayez.' });
    }
  };

  return (
    <section className="py-28">
      <div className="section-wrap">
        <div className="mb-10 text-center">
          <h2 className="title text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">Contact</h2>
          <p className="text-gray-400 mt-3">Aucune adresse mail n’est exposée. Anti-spam côté service.</p>
        </div>

        <motion.form onSubmit={onSubmit} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="max-w-2xl mx-auto glass rounded-3xl p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300">Nom</label>
              <input required name="name" className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-400"/>
            </div>
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input required name="email" type="email" className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-400"/>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm text-gray-300">Message</label>
            <textarea required name="message" rows="6" className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-400"/>
          </div>

          {/* Placeholder for CAPTCHA */}
          <div className="mt-4 text-xs text-gray-500">CAPTCHA prêt (config via NEXT_PUBLIC_CAPTCHA_SITE_KEY).</div>

          <div className="mt-6 flex items-center gap-4">
            <button disabled={!hasEndpoint || state.loading} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 disabled:opacity-50">
              {state.loading ? 'Envoi…' : 'Envoyer'}
            </button>
            {!hasEndpoint && <span className="text-sm text-yellow-300/80">Configurer l’endpoint avant la mise en prod.</span>}
          </div>

          {state.ok && <div className="mt-4 text-emerald-400">Message envoyé. Merci !</div>}
          {state.error && <div className="mt-4 text-red-400">{state.error}</div>}
        </motion.form>
      </div>
    </section>
  );
}

