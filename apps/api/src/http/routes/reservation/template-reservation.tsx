import React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Row,
  Column,
  Section,
} from '@react-email/components'

interface ReservationTemplate {
  orgName: string
  name: string
  date: string
  hour: string
  numberOfPeople: number
}

export function ReservationTemplate({
  orgName,
  numberOfPeople,
  date,
  hour,
  name,
}: ReservationTemplate) {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f7f7f7',
          color: '#333',
        }}
      >
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            padding: '20px',
            border: '1px solid #dddddd',
          }}
        >
          {/* Cabeçalho */}
          <Heading
            style={{
              textAlign: 'center',
              backgroundColor: 'rgb(153, 27, 27)',
              color: '#ffffff',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            Siricascudo
          </Heading>

          {/* Saudação */}
          <Text
            style={{
              fontSize: '16px',
              lineHeight: '1.5',
              marginBottom: '20px',
            }}
          >
            Olá, <strong>{name}</strong>,
          </Text>
          <Text
            style={{
              fontSize: '16px',
              lineHeight: '1.5',
              marginBottom: '20px',
            }}
          >
            Sua reserva no <strong>{orgName}</strong> foi confirmada com
            sucesso!
          </Text>

          {/* Detalhes da Reserva */}

          <Section
            style={{
              borderCollapse: 'collapse',
              borderSpacing: '0px',
              color: 'rgb(51,51,51)',
              backgroundColor: 'rgb(250,250,250)',
              borderRadius: '3px',
              fontSize: '12px',
            }}
          >
            <Text>
              <strong>Reservado em nome de: </strong>
              {name}
            </Text>
            <Text>
              <strong>Data: </strong>
              {date}
            </Text>
            <Text>
              <strong>Hora: </strong>
              {hour}
            </Text>
            <Text>
              <strong>Número de pessoas: </strong>
              {numberOfPeople}
            </Text>
          </Section>

          {/* Contato */}
          {/* <Text
            style={{
              fontSize: '16px',
              lineHeight: '1.5',
              marginBottom: '20px',
            }}
          >
            Caso precise alterar ou cancelar sua reserva, entre em contato
            conosco pelo telefone <strong>(00) 1234-5678</strong>.
          </Text> */}

          {/* Rodapé */}
          <Text
            style={{ fontSize: '14px', color: '#888', textAlign: 'center' }}
          >
            Siricascudo &copy; 2024. Todos os direitos reservados.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
