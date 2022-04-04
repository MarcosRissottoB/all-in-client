import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import useAllinNfts from '../../hooks/useAllinNFTs';
import { useCallback, useEffect, useState } from "react";

const Home = () => {
  const [imageSrc, setImageSrc] = useState("/images/ENTIDAD-0.png");
  const [lastNumber, setLastNumber] = useState(0);
  const [isMinting, setIsMinting] = useState(false);

  const { active, account } = useWeb3React();
  const allinNfts = useAllinNfts();
  const toast = useToast();

  const getAllinData = useCallback(async() => {
    if(allinNfts) {
      const totalSupply = await allinNfts.methods.totalSupply().call();
      const dnaPreview = await allinNfts.methods
        .deterministicPseudoRandomDNA(totalSupply, account)
        .call();
      // const image = await allinNfts.methods.imageByDNA(dnaPreview).call();
      let randomNumber = Math.floor(Math.random()*(3-1+1)+1);
      if(randomNumber === lastNumber) {
        randomNumber = 0;
      }
      const image = `/images/ENTIDAD-${randomNumber}.png`;
      setImageSrc(image);
      setLastNumber(randomNumber)
    }
  }, [allinNfts, account]);

  useEffect(() => {
    getAllinData();
  }, [getAllinData]);

  const mint = () => {
    setIsMinting(true);
    allinNfts.methods.mint().send({
      from: account,
      // value: 1e18,
    })
    .on('transactionHash', (txHash) => {
      toast({
        title: 'Transacción enviada',
        description: txHash,
        status: 'info'
      })
    })
    .on('receipt', () => {
      setIsMinting(false);
      toast({
        title: 'Transacción confirmada',
        description: 'Continúa rompiendo barreras',
        status: 'success'
      })
    })
    .on('error', (error) => {
      setIsMinting(false);
      toast({
        title: 'Transacción fallída',
        description: error.message,
        status: 'error'
      })
    })
  };
  
  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 28 }}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text
            as={"span"}
            position={"relative"}
            _after={{
              content: "''",
              width: "full",
              height: "30%",
              position: "absolute",
              bottom: 1,
              left: 0,
              bg: "red.400",
              zIndex: -1,
            }}
          >
            ALL IN
          </Text>
          <br />
          <Text as={"span"} color={"red.400"}>
            Rompiendo barreras
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          ALL IN es una colecci&oacute;n de membresías cuya metadata
          es almacenada on-chain. 
        </Text>
        <Text color={"red.500"}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
         ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={{ base: "column", sm: "row" }}
        >
          <Button
            rounded={"full"}
            size={"lg"}
            fontWeight={"normal"}
            px={6}
            colorScheme={"red"}
            bg={"red.400"}
            _hover={{ bg: "red.500" }}
            disabled={!allinNfts}
            onClick={mint}
            isLoading={isMinting}
          >
            Obt&eacute;n tu Allin
          </Button>
          <Link to="/Allin">
            <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
              Galer&iacute;a
            </Button>
          </Link>
        </Stack>
      </Stack>
      <Flex
        flex={1}
        direction="column"
        justify={"center"}
        align={"center"}
        position={"relative"}
        w={"full"}
      >
        <Image src={imageSrc} maxWidth={400}/> 
        
        {active ? (
          <>
            <Flex mt={2}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="red">
                  1
                </Badge>
              </Badge>
              <Badge ml={2}>
                Address:
                <Badge ml={1} colorScheme="red">
                  0x0000...0000
                </Badge>
              </Badge>
            </Flex>
            <Button
              onClick={getAllinData}
              mt={4}
              size="xs"
              colorScheme="red"
            >
              Actualizar
            </Button>
          </>
        ) : (
          <Badge mt={2}>Wallet desconectado</Badge>
        )}
      </Flex>
    </Stack>
  );
};

export default Home;
