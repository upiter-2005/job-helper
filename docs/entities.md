-- диалог (сессия)
conversations
  id          uuid  PK          -- тот самый sessionId
  created_at  timestamptz       default now()

-- сообщения диалога
messages
  id               bigint  PK  generated always as identity
  conversation_id  uuid    FK → conversations(id)
  role             text    check (role in ('user','assistant'))
  content          text    not null
  created_at       timestamptz default now()