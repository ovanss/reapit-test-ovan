import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { ReapitConnectSession } from '@reapit/connect-session'
import { ListItemModel } from '@reapit/foundations-ts-definitions'
import { BASE_HEADERS } from '../../../constants/api'
// import { configurationAppointmentsApiService } from '../../../platform-api/configuration-api'
import { reapitConnectBrowserSession } from '../../../core/connect-session'
import { useReapitConnect } from '@reapit/connect-session'

import {
  Button,
  ButtonGroup,
  elMb7,
  TableCell,
  Icon,
  PersistantNotification,
  // StatusIndicator,
  Table,
  TableHeader,
  TableHeadersRow,
  TableRow,
  TableRowContainer,
  Title,
  // useModal,
  TableExpandableRow,
  // TableExpandableRowTriggerCell,
  Molecule,
  Subtitle,
  InputWrap,
  InputGroup,
  TableExpandableRowTriggerCell,
} from '@reapit/elements'

export const handleOnCloseModal =
  (setIndexExpandedRow: Dispatch<SetStateAction<number | null>>, closeModal: () => void) => () => {
    setIndexExpandedRow(null)
    closeModal()
  }

interface IProp {
  id: string
  address: string
  price: number
}

export const TableExample: FC = () => {
  const { connectSession } = useReapitConnect(reapitConnectBrowserSession)

  // const [indexExpandedRow, setIndexExpandedRow] = useState<number | null>(null)
  // const { Modal, openModal, closeModal } = useModal()
  const [properties, setProperties] = useState<IProp[]>([])
  const [loading, setLoading] = useState(false)
  const [headers, setHeaders] = useState<string[]>([])
  const [activeDataId, setActiveDataId] = useState('')
  const [newAddress, setNewAddress] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setProperties((prevState) => {
      return prevState.map((property: any) => {
        if (property.id === activeDataId) {
          return { ...property, address: newAddress }
        }
        return property
      })
    })
    setNewAddress('')
  }

  const fetchProperties = async (session: ReapitConnectSession | null): Promise<ListItemModel[] | undefined | any> => {
    try {
      if (!session) return

      const response = await fetch('https://platform.reapit.cloud/properties/?marketingMode=selling', {
        method: 'GET',
        headers: {
          ...BASE_HEADERS,
          Authorization: `Bearer ${session?.accessToken}`,
        },
      })
      console.log(response)
      if (response.ok) {
        const responseJson: Promise<ListItemModel[] | undefined> = response.json()
        console.log(responseJson)
        return responseJson
      }
    } catch (e) {
      console.log(e)
    }
  }

  // const fetchData = async () => {
  //   const data = await fetchProperties(connectSession)
  //   if (!data) {
  //     console.log(data)
  //   }
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await fetchProperties(connectSession)
        if (result) {
          const { _embedded } = result
          const newData = _embedded.map((data: any) => {
            return { id: data.id, address: data.address.line1, price: data.selling.price }
          })

          console.log(newData)
          setHeaders(Object.keys(newData[0]))
          setProperties(newData)
          // console.log('🙌🙌', newData.filter((data) => data.id === activeDataId)[0].address)
        }
        setLoading(false)
      } catch (err) {
        console.log(err)
      }
    }

    if (connectSession) {
      fetchData()
    }
    // fetchData
  }, [connectSession])

  if (loading) {
    return <p>loading...</p>
  }

  // if (properties.length === 0) return null

  // const headers = Object.keys(properties[0])
  // console.log('headers', headers)

  return (
    <>
      <Title>Properties for Sale</Title>
      <PersistantNotification className={elMb7} isExpanded intent="secondary" isInline isFullWidth>
        Straight from the Elements docs, the customised table example also has a button in the slide down that triggers
        a Modal dialogue. The custom setIndexExpandedRow function allows a callback to collapse the row when the modal
        is closed.
      </PersistantNotification>
      <Table data-num-columns-excl-action-col="7" data-has-expandable-action>
        <TableHeadersRow>
          {headers.map((header, i) => {
            console.log('header', header)
            return <TableHeader key={i}>{header}</TableHeader>
          })}
          <TableHeader>
            <Icon icon="editSystem" fontSize="1.2rem" />
          </TableHeader>
        </TableHeadersRow>
        <TableRowContainer>
          {/* <TableRow>
            <TableCell darkText icon="homeSystem" narrowIsFullWidth>
              Mt Ash Jacket Brassey Road
            </TableCell>
            <TableCell narrowLabel="Name Customer" icon="usernameSystem">
              Mr Johnny Corrigan
            </TableCell>
            <TableCell narrowLabel="Account">Alternate Lettings Client Acc</TableCell>
            <TableCell narrowLabel="Type">Tenant Payment Request</TableCell>
            <TableCell narrowLabel="Request Date">19 Apr 2021</TableCell>
            <TableCell darkText narrowLabel="Amount">
              £50.00
            </TableCell>
            <TableCell narrowLabel="Status">
              <StatusIndicator intent="critical" /> Pending
            </TableCell>
            <TableExpandableRowTriggerCell isOpen />
          </TableRow> */}
          {properties.map((property: any) => {
            console.log(property)
            return (
              <TableRow
                key={property.id}
                onClick={() => {
                  console.log('Click', property.id)
                  setActiveDataId(property.id)
                  setNewAddress(properties.filter((data: any) => data?.id === activeDataId)[0]?.address)
                }}
              >
                {Object.values(property).map((row: any, i) => {
                  // console.log('row', row)

                  return <TableCell key={i}>{row}</TableCell>
                })}
                <TableExpandableRowTriggerCell isOpen />
              </TableRow>
            )
          })}
          <TableExpandableRow isOpen>
            <Molecule>
              <Subtitle>Form Example</Subtitle>
              <form onSubmit={handleSubmit}>
                {/* <InputWrap>
                  <InputGroup icon="homeSystem" label="Please enter an address" type="text" />
                </InputWrap> */}
                <InputWrap>
                  <InputGroup
                    label="Please enter your address"
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                </InputWrap>
                <InputWrap />
                <InputWrap>
                  <ButtonGroup>
                    <Button chevronRight intent="primary">
                      update address
                    </Button>
                  </ButtonGroup>
                </InputWrap>
              </form>
            </Molecule>
          </TableExpandableRow>
        </TableRowContainer>
      </Table>
      {/* <Modal title="Modal Opened">
        <PersistantNotification className={elMb6} isExpanded isInline isFullWidth intent="danger">
          Closing me will collapse the table row
        </PersistantNotification>
        <BodyText hasGreyText>Typically Modals are used to confirm or deny things.</BodyText>
        <ButtonGroup alignment="center">
          <Button intent="secondary" onClick={handleOnCloseModal(setIndexExpandedRow, closeModal)}>
            Close
          </Button>
          <button></button>
        </ButtonGroup>
      </Modal> */}
    </>
  )
}

export default TableExample
