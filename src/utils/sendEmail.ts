import { resolve, dirname } from 'path'

import nodemailer from 'nodemailer'
import Email from 'email-templates'
import { config } from '../config/env.config'

export default async (data: {
	email: string
	locals: object
	template: string
}) => {

	console.log("dddddd");
	
	const { email, locals, template } = data
	console.log('sendemail', email)

	const emailObj = new Email({
		message: {
			from: { name: config.email.name!, address: config.email.from! },
		},
		send: true,
		transport: nodemailer.createTransport({
			host: config.smpt.host,
			port: +config.smpt.port!,
			auth: {
				user: config.smpt.email,
				pass: config.smpt.password,
			},
		}),
		views: {
			root: resolve(dirname(__dirname) + '/emails/'),
			options: {
				extension: 'njk',
			},
		},
		// preview: false,
	})

	const mail = await emailObj.send({
		template,
		message: {
			to: email,
		},
		locals: {
			...locals,
		},
	})
	console.log('Message sent: %s', mail.messageId)
}
