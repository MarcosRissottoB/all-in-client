import { useState, useEffect } from 'react';
import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router-dom";
import RequestAccess from "../../components/request-access";
import AllinCard from "../../components/allin-card";
import Loading from "../../components/loading";
import { useAllinsData } from "../../hooks/useAllinsData";
import useAllinNfts from '../../hooks/useAllinNFTs';

const Allin = () => {
  const { active, account, library } = useWeb3React();
  const { tokenId } = useParams();
  const { loading, allin, update } = useAllinsData(tokenId);
  const toast = useToast();
  const [transfering, setTransfering] = useState(false);
  const allinNfts = useAllinNfts();

  const transfer = () => {
    setTransfering(true);

    const address = prompt("Ingresa la dirección: ");
    const isAddress = library.utils.isAddress(address);

    if(!isAddress) {
      toast({
        title: 'Address inválido',
        description: 'El Address es incorrecta',
        status: 'error',
      })
      setTransfering(false);
    } else {
      console.log('allin', allin);
      allinNfts.methods.safeTransferFrom(
        '0xDf3E7437Ece1ba40e689d9c61244dC93aF660f70', // allin.owner,
        address,
        2, // allin.tokenId,
      ).send({
        from: account,
      })
      .on('error', (error) => {
        setTransfering(false);
        toast({
          title: 'Transacción fallída',
          description: error.message,
          status: 'error'
        })
      })
      .on('transactionHash', (txHash) => {
        toast({
          title: 'Transacción enviada',
          description: txHash,
          status: 'info'
        })
      })
      .on('receipt', () => {
        setTransfering(false);
        toast({
          title: 'Transacción confirmada',
          description: `El ALLIN Nft, ahora pertenece a: ${address}`,
          status: 'success'
        })
        update();
      })
    }
    setTransfering(false);
  }

  useEffect( () => {}, [account]);

  if (!active) return <RequestAccess />;
  if (loading && !allin) return <Loading />;

  return (
    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: "column", md: "row" }}
    >
      <Stack>
        <AllinCard
          mx={{
            base: "auto",
            md: 0,
          }}
          // name={allin.name}
          // image={allin.image}
          name={`Product-${tokenId+1}`}
          image={`/images/ENTIDAD-${tokenId}.png`}
        />
        {/* <Button disabled={account !== allin.owner} colorScheme="red"> */}
        <Button colorScheme="red"
          onClick={transfer}
          isLoading={transfering}
        >
          Transferir
          {/* {account !== allin.owner ? "No eres el dueño" : "Transferir"} */}
        </Button>
      </Stack>
      <Stack width="100%" spacing={5}>
        {/* <Heading>{allin.name}</Heading> */}
        <Heading>{`Product-${tokenId}`}</Heading>
        {/* <Text fontSize="xl">{allin.description}</Text> */}
        <Text fontSize="xl">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas cursus facilisis purus id sollicitudin. In pharetra ac sapien sit amet molestie.
        </Text>
        {/* <Text fontWeight={600}>
          DNA:
          <Tag ml={2} colorScheme="red">
            {allin.dna}
          </Tag>
        </Text> */}
        <Text fontWeight={600}>
          Owner:
          <Tag ml={2} colorScheme="red">
            {/* {allin.owner} */}
            {account}
          </Tag>
        </Text>
        {/* <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Atributo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(allin.attributes).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <Tag>{value}</Tag>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table> */}
      </Stack>
    </Stack>
    );
  };
  
  export default Allin;