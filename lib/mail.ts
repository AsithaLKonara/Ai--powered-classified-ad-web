import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAdApprovedEmail = async (email: string, name: string, adTitle: string, adUrl: string) => {
    try {
        await resend.emails.send({
            from: 'ClassifiedHub <notifications@your-domain.com>',
            to: email,
            subject: 'Your Ad is Live! 🚀',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00ff84;">Congratulations ${name}!</h2>
          <p>Your advertisement <strong>"${adTitle}"</strong> has been approved and is now live on ClassifiedHub.</p>
          <div style="margin: 30px 0;">
            <a href="${adUrl}" style="background-color: #00ff84; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; rounded: 5px;">View Your Ad</a>
          </div>
          <p style="color: #666; font-size: 14px;">Thank you for using our platform!</p>
        </div>
      `,
        });
    } catch (error) {
        console.error('Email error:', error);
    }
};

export const sendNewMessageEmail = async (email: string, senderName: string, adTitle: string, chatUrl: string) => {
    try {
        await resend.emails.send({
            from: 'ClassifiedHub <notifications@your-domain.com>',
            to: email,
            subject: `New message from ${senderName}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00ff84;">You have a new message!</h2>
          <p><strong>${senderName}</strong> sent you a message regarding your ad <strong>"${adTitle}"</strong>.</p>
          <div style="margin: 30px 0;">
            <a href="${chatUrl}" style="background-color: #00ff84; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; rounded: 5px;">Reply Now</a>
          </div>
          <p style="color: #666; font-size: 14px;">Stay safe and happy selling!</p>
        </div>
      `,
        });
    } catch (error) {
        console.error('Email error:', error);
    }
};
