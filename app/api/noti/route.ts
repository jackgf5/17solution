import { NextResponse } from "next/server"
import { Expo, ExpoPushMessage } from "expo-server-sdk"

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN })

export async function POST(request: Request) {
  const body = await request.json()
  const { notiTitle, notiBody, expoTokens } = body

  if (!notiTitle || !notiBody || !expoTokens) {
    return NextResponse.json({ msg: "Missing Fields" }, { status: 400 })
  }

  const messages: ExpoPushMessage[] = []
  for (const expoToken of expoTokens) {
    if (!Expo.isExpoPushToken(expoToken)) {
      console.error(`Push token ${expoToken} is not a valid Expo push token`)
      continue
    }

    const pushMessage: ExpoPushMessage = {
      to: expoToken,
      sound: "default",
      title: notiTitle,
      body: notiBody,
    }

    messages.push(pushMessage)
  }

  const chunks = expo.chunkPushNotifications(messages)

  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk)
    } catch (error) {
      console.error(error)
    }
  }

  return NextResponse.json({ msg: "Notification Sent" }, { status: 200 })
}
