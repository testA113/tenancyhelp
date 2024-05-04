import { Card } from "../_components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 mt-20">
      <Card>
        <h1 className="mb-8">Privacy</h1>
        <h2>What we collect</h2>
        <p>
          To improve our service, we may anonymously log your queries and their
          associated results. We do not associate your queries with any
          personally-identifiable information such as your IP address or login
          information.
        </p>
        <h2>How we use your data</h2>
        <p>
          Your data may be used to improve our product and machine learning
          models. We will never sell your data to any third party.
        </p>
      </Card>
    </div>
  );
}
