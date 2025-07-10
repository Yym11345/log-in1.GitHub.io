@@ .. @@
 export interface Database {
   public: {
     Tables: {
-      genes: {
+      gene: {
         Row: {
-          id: string;
-          name: string;
-          organism: string;
-          enzyme_type: string;
-          function: string;
-          sequence: string;
-          length: number;
-          domain: string;
-          accession: string;
-          completeness: 'complete' | 'partial';
-          created_at: string;
-          updated_at: string;
+          "Entry": string;
+          "Reviewed": string | null;
+          "Entry Name": string | null;
+          "Protein names": string | null;
+          "Gene Names": string | null;
+          "Organism": string | null;
+          "Length": number | null;
+          "Sequence": string | null;
+          "Active site": string | null;
+          "Catalytic activity": string | null;
+          "EC number": string | null;
         };
         Insert: {
-          id?: string;
-          name: string;
-          organism: string;
-          enzyme_type: string;
-          function: string;
-          sequence: string;
-          length: number;
-          domain: string;
-          accession: string;
-          completeness: 'complete' | 'partial';
-          created_at?: string;
-          updated_at?: string;
+          "Entry": string;
+          "Reviewed"?: string | null;
+          "Entry Name"?: string | null;
+          "Protein names"?: string | null;
+          "Gene Names"?: string | null;
+          "Organism"?: string | null;
+          "Length"?: number | null;
+          "Sequence"?: string | null;
+          "Active site"?: string | null;
+          "Catalytic activity"?: string | null;
+          "EC number"?: string | null;
         };
         Update: {
-          id?: string;
-          name?: string;
-          organism?: string;
-          enzyme_type?: string;
-          function?: string;
-          sequence?: string;
-          length?: number;
-          domain?: string;
-          accession?: string;
-          completeness?: 'complete' | 'partial';
-          updated_at?: string;
+          "Entry"?: string;
+          "Reviewed"?: string | null;
+          "Entry Name"?: string | null;
+          "Protein names"?: string | null;
+          "Gene Names"?: string | null;
+          "Organism"?: string | null;
+          "Length"?: number | null;
+          "Sequence"?: string | null;
+          "Active site"?: string | null;
+          "Catalytic activity"?: string | null;
+          "EC number"?: string | null;
         };
       };
       user_profiles: {