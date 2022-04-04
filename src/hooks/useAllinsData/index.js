import { useState, useCallback, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import useAllinNfts from '../useAllinNFTs';

const getAllinData = async ({allinNfts, tokenId}) => {
  const [
    tokenURI,
    dna,
    owner,
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    allinNfts.methods.tokenURI(tokenId).call(),
    allinNfts.methods.tokenDNA(tokenId).call(),
    allinNfts.methods.ownerOf(tokenId).call(),
    allinNfts.methods.getAccessoriesType(tokenId).call(),
    allinNfts.methods.getAccessoriesType(tokenId).call(),
    allinNfts.methods.getClotheColor(tokenId).call(),
    allinNfts.methods.getClotheType(tokenId).call(),
    allinNfts.methods.getEyeType(tokenId).call(),
    allinNfts.methods.getEyeBrowType(tokenId).call(),
    allinNfts.methods.getFacialHairColor(tokenId).call(),
    allinNfts.methods.getFacialHairType(tokenId).call(),
    allinNfts.methods.getHairColor(tokenId).call(),
    allinNfts.methods.getHatColor(tokenId).call(),
    allinNfts.methods.getGraphicType(tokenId).call(),
    allinNfts.methods.getMouthType(tokenId).call(),
    allinNfts.methods.getSkinColor(tokenId).call(),
    allinNfts.methods.getTopType(tokenId).call(),
  ]);

  const responseMetadata = await fetch(tokenURI);
  const metadata = await responseMetadata.json();
  return {
    tokenId,
    attributes:{
      accessoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    tokenURI,
    dna,
    owner,
    ...metadata
  }
}

const useAllinsData = ({ owner = null } = {}) => {
  const [allins, setAllin] = useState([]);
  const { library } = useWeb3React();
  const [loading, setLoading] = useState(true);
  
  const allinNfts = useAllinNfts();

  const update = useCallback(async() =>{
    if(allinNfts) {
      setLoading(true);

      let tokenIds;
      if(!library.utils.isAddress(owner)) {
        const totalSupply = await allinNfts.methods.totalSupply().call();
        tokenIds = new Array(Number(totalSupply))
          .fill()
          .map((_, index) => index);
      } else {
        const balanceOf = await allinNfts.methods.balanceOf(owner).call();
        const tokenIdsOfOwner = new Array(Number(balanceOf))
          .fill()
          .map((_, index) => 
            allinNfts.methods.tokenOfOwnerByIndex(owner, index).call()
        );
        tokenIds = await Promise.all(tokenIdsOfOwner);
      }

      const allinPromise = tokenIds.map((tokenId) => getAllinData({tokenId, allinNfts}));
      
      const allins = await Promise.all(allinPromise);
      setAllin(allins);

      setLoading(false);
    }
  }, [allinNfts, owner, library?.utils]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    allins,
    update,
  }
}

// Singular
const useAllinData = (tokenId = null) => {
  const [allin, setAllin] = useState({});
  const [loading, setLoading] = useState(true);
  const allinNfts = useAllinNfts();

  const update = useCallback(async () => {
    if (allinNfts && tokenId != null) {
      setLoading(true);

      const toSet = await getAllinData({ tokenId, allinNfts });
      console.log('toSet', toSet);
      setAllin(toSet);
      setLoading(false);
    }
  }, [allinNfts, tokenId]);

  useEffect(() => {
    update();
    console.log('update');
  }, [update]);

  return {
    loading,
    allin,
    update,
  };
};

export { useAllinsData, useAllinData };