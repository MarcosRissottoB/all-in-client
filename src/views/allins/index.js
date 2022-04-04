import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Grid,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
  FormHelperText,
  FormControl,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import AllinCard from '../../components/allin-card';
import Loading from '../../components/loading';
import RequestAccess from '../../components/request-access';
import { useAllinsData } from '../../hooks/useAllinsData';

const Allins = () => {
  // const [lastNumber, setLastNumber] = useState(0);
  const { search } = useLocation();
  const [address, setAddress] = useState(new URLSearchParams(search).get('address'));
  const [submitted, setSubmitted] = useState(true);
  const [validAddress, setValidAddress] = useState(true);
  const { active, library } = useWeb3React();
  const { allins, loading, 
    // update
   } = useAllinsData({
     owner: submitted && validAddress ? address : null,
   });

  const navigate = useNavigate();

  const handleAddressChange = ({target: {value}}) => {
    setAddress(value);
    setSubmitted(false);
    setValidAddress(false);
  }

  const submit = (e) => {
    e.preventDefault();
    if(address) {
      const isValid = library.utils.isAddress(address);
      setValidAddress(isValid);
      setSubmitted(true);
      if (isValid) navigate(`/allins?address=${address}`);
    } else {
      navigate('/allins');
    }
  }

  if(!active) return <RequestAccess />

  // const makeRandomImage = () => {
  //   let randomNumber = Math.floor(Math.random()*(3-1+1)+1);
  //     if(randomNumber === lastNumber) {
  //       randomNumber = 0;
  //     }
  //     setLastNumber(randomNumber)
  //     return `/images/ENTIDAD-${randomNumber}.png`;
  // }

  return (
    <>
      <form onSubmit={submit}>
        <FormControl >
          <InputGroup mb={3}>
            <InputLeftElement pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input 
              isInvalid={false}
              value={address ?? ''}
              onChange={handleAddressChange}
              placeholder="Buscar por Adrress"
            />
            <InputRightElement width="5.5rem">
              <Button type="submit" h="1.7rem" size="sm">
                Buscar
              </Button>
            </InputRightElement>
          </InputGroup>
          {
            submitted && !validAddress && <FormHelperText color="red">
              Address inválida
            </FormHelperText>
          }
        </FormControl>
      </form>
      { loading ? <Loading />
        : <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap="6">
            {/* {allins.map(allin) => ( */}
            {allins.map(({
              name,
              // image,
              tokenId}) => (
                <Link  key={tokenId} to={`/allins/${tokenId}`}>
                  <AllinCard
                   
                    // image={image}
                    image={`/images/ENTIDAD-${tokenId}.png`}
                    name={`Product-${tokenId+1}`}
                  />
                </Link>
                ))}
          </Grid>
      }
    </>
  )
}

export default Allins;