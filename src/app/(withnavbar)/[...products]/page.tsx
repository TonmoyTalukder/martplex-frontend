import AllProducts from '@/src/components/products/AllProducts';

const ProductPage = ({
  searchParams,
}: {
  searchParams: {
    searchTerm?: string;
    category?: string;
    sale?: string;
    martplex?: string;
  };
}) => {
  const searchTerm = searchParams.searchTerm || '';
  const category = searchParams.category || '';
  const sale = searchParams.sale || '';
  const martplex = searchParams.martplex || '';

  return (
    <div
      style={{
        paddingLeft: '5%',
        paddingRight: '5%',
      }}
    >
      <AllProducts
        searchTerm={searchTerm}
        category={category}
        sale={sale}
        martplex={martplex}
      />
    </div>
  );
};

export default ProductPage;
