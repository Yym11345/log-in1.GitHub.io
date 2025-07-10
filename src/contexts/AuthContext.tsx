@@ .. @@
   useEffect(() => {
-    // Check if supabase client is properly configured
-    if (!supabase) {
-      setSession(null);
-      setUser(null);
-      setLoading(false);
-      return;
-    }
-
-    // 获取初始会话
-    supabase.auth.getSession().then(({ data: { session } }) => {
-      setSession(session);
-      setUser(session?.user ?? null);
-      setLoading(false);
-    });
-
-    // 监听认证状态变化
-    const {
-      data: { subscription },
-    } = supabase.auth.onAuthStateChange((_event, session) => {
-      setSession(session);
-      setUser(session?.user ?? null);
-      setLoading(false);
-    });
-
-    return () => subscription.unsubscribe();
+    const initAuth = async () => {
+      try {
+        // Check if supabase client is properly configured
+        if (!supabase) {
+          console.log('Supabase not configured, running in demo mode');
+          setSession(null);
+          setUser(null);
+          setLoading(false);
+          return;
+        }
+
+        // 获取初始会话
+        const { data: { session }, error } = await supabase.auth.getSession();
+        
+        if (error) {
+          console.error('Error getting session:', error);
+        }
+        
+        setSession(session);
+        setUser(session?.user ?? null);
+        setLoading(false);
+
+        // 监听认证状态变化
+        const {
+          data: { subscription },
+        } = supabase.auth.onAuthStateChange((_event, session) => {
+          setSession(session);
+          setUser(session?.user ?? null);
+          setLoading(false);
+        });
+
+        return () => subscription.unsubscribe();
+      } catch (error) {
+        console.error('Auth initialization error:', error);
+        setSession(null);
+        setUser(null);
+        setLoading(false);
+      }
+    };
+
+    initAuth();
   }, []);