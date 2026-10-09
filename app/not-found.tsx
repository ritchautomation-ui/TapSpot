import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-28 text-center">
      <h1 className="text-5xl font-bold">Page not found</h1>
      <p className="mt-3 text-mute">That page doesn't exist. Try our products instead.</p>
      <ButtonLink href="/products" variant="dark" className="mt-8">Browse products</ButtonLink>
    </Container>
  );
}
