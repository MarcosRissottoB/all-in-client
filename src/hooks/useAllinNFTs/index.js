import { useMemo } from 'react';
import { useWeb3React } from "@web3-react/core";
import AllInNFTArtifact from '../../config/web3/artifacts/AllinNFT';

const { address, abi } = AllInNFTArtifact;

const useAllinNfts = () => {
  const { active, library, chainId} = useWeb3React();

  const allinNfts = useMemo(() => {
    if (active) return new library.eth.Contract(abi,address[chainId]);
  }, [active, chainId, library?.eth?.Contract]);
  
  return allinNfts;
}

export default useAllinNfts;