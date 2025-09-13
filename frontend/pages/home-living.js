import React from 'react';
import Head from 'next/head';

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/',
      permanent: false
    }
  };
}

export default function HomeLivingPage() {
  return null;
}
