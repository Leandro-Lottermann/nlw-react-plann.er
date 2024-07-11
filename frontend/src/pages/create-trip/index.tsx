import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InviteGuestsModal } from './invite-guests-modal'
import { ConfirmTripModal } from './confirm-trip-modal'
import { DestinationAndDateStep } from './steps/destination-and-date-step'
import { InviteGuestsStep } from './steps/invite-guests-step'
import { DateRange } from 'react-day-picker'
import { api } from '../../lib/axios'

export function CreateTripPage() {
  const [isGuestsInputOpen, setGuestsInputOpen] = useState(false)
  const [isGuestsModalOpen, setGuestsModalOpen] = useState(false)
  const [isConfirmTripModalOpen, setConfirmTripModalOpen] = useState(false)

  const [destination, setDestination] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [eventStardAndDates, setEventStardAndDates] = useState<
    DateRange | undefined
  >()
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])
  const navigate = useNavigate()

  function openGuestsInput() {
    setGuestsInputOpen(true)
  }

  function closeGuestsInput() {
    setGuestsInputOpen(false)
  }

  function openGuestsModal() {
    setGuestsModalOpen(true)
  }

  function closeGuestsModal() {
    setGuestsModalOpen(false)
  }

  function openConfirmTripModal() {
    setConfirmTripModalOpen(true)
  }

  function closeConfirmTripModal() {
    setConfirmTripModalOpen(false)
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    console.log(destination)
    console.log(ownerName)
    console.log(ownerEmail)
    console.log(eventStardAndDates)
    console.log(emailsToInvite)

    if (!destination) {
      return
    }

    if (!eventStardAndDates) {
      return
    }

    if (!eventStardAndDates.from || !eventStardAndDates.from) {
      return
    }

    if (emailsToInvite.length === 0) {
      return
    }

    if (!ownerName || !ownerEmail) {
      return
    }

    const response = await api.post('/trips', {
      destination,
      starts_at: eventStardAndDates.from,
      ends_at: eventStardAndDates.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail,
    })

    const { tripId } = response.data
    navigate(`/trips/${tripId}`)
  }

  function addEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if (email && !emailsToInvite.includes(email)) {
      setEmailsToInvite([...emailsToInvite, email])
    }

    event.currentTarget.reset()
  }

  function removeEmailFromInvite(email: string) {
    setEmailsToInvite(emailsToInvite.filter((e) => e !== email))
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center  space-y-10">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="" />
          <p className="text-zinc-300 text-lg">
            Convide seus amigos e planeje sua próxima viagem!
          </p>
        </div>

        <div className="space-y-4">
          <DestinationAndDateStep
            eventStardAndDates={eventStardAndDates}
            setEventStardAndDates={setEventStardAndDates}
            closeGuestsInput={closeGuestsInput}
            isGuestsInputOpen={isGuestsInputOpen}
            openGuestsInput={openGuestsInput}
            setDestination={setDestination}
          />
          {isGuestsInputOpen && (
            <InviteGuestsStep
              emailsToInvite={emailsToInvite}
              openConfirmTripModal={openConfirmTripModal}
              openGuestsModal={openGuestsModal}
            />
          )}
        </div>

        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pela plann.er você automaticamente concorda
          <br /> com nossos{' '}
          <a href="#" className="text-zinc-300 underline">
            termos de uso
          </a>{' '}
          e{' '}
          <a href="#" className="text-zinc-300 underline">
            políticas de privacidade
          </a>
          .
        </p>
      </div>

      {isGuestsModalOpen && (
        <InviteGuestsModal
          addEmailToInvite={addEmailToInvite}
          emailsToInvite={emailsToInvite}
          closeGuestsModal={closeGuestsModal}
          removeEmailFromInvite={removeEmailFromInvite}
        />
      )}

      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
          closeConfirmTripModal={closeConfirmTripModal}
          createTrip={createTrip}
        />
      )}
    </div>
  )
}
