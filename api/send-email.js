import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Méthode non autorisée" });
  }

  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || name.length < 2) return res.status(400).json({ success: false, message: "Nom invalide" });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, message: "Email invalide" });
  if (!subject || subject.length < 3) return res.status(400).json({ success: false, message: "Sujet invalide" });
  if (!message || message.length < 10) return res.status(400).json({ success: false, message: "Message trop court" });

  try {
    await resend.emails.send({
      from: `Portfolio <${process.env.PORTFOLIO_EMAIL}>`,
      to: [process.env.PORTFOLIO_EMAIL],
      replyTo: email,
      subject: `Nouveau message depuis votre portfolio: ${subject}`,
      html: `
        <h2>Nouveau message depuis votre portfolio</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Sujet:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `
    });

    return res.status(200).json({ success: true, message: "Votre message a été envoyé avec succès !" });
  } catch (error) {
    console.error("Erreur Resend:", error);
    return res.status(500).json({ success: false, message: "Erreur lors de l'envoi du message." });
  }
}
